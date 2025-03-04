import { libraryApiManager } from '../src/services/externalLibraries.js';
import { resourceAPI } from '../src/services/api.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Configuration
const SYNC_INTERVAL = process.env.VITE_SYNC_INTERVAL || 86400000; // Default: 24 hours
const SYNC_LOG_FILE = path.join(process.cwd(), 'sync-log.json');
const MAX_RESOURCES_PER_SYNC = 500; // Limit the number of resources to sync at once

// Load the last sync time
const loadLastSyncTime = () => {
  try {
    if (fs.existsSync(SYNC_LOG_FILE)) {
      const logData = JSON.parse(fs.readFileSync(SYNC_LOG_FILE, 'utf8'));
      return logData.lastSyncTime;
    }
  } catch (error) {
    console.error('Error loading last sync time:', error);
  }
  return null;
};

// Save the sync log
const saveSyncLog = (lastSyncTime, resourcesAdded) => {
  try {
    const logData = {
      lastSyncTime,
      resourcesAdded,
      lastSyncRun: new Date().toISOString()
    };
    fs.writeFileSync(SYNC_LOG_FILE, JSON.stringify(logData, null, 2));
    console.log(`Sync log saved. Added ${resourcesAdded} resources.`);
  } catch (error) {
    console.error('Error saving sync log:', error);
  }
};

// Initialize the library API manager
const initializeLibraryManager = async () => {
  try {
    await libraryApiManager.initialize();
    const providers = libraryApiManager.getAvailableProviders();
    console.log(`Initialized ${providers.length} library providers:`, providers.map(p => p.name).join(', '));
    return true;
  } catch (error) {
    console.error('Error initializing library API manager:', error);
    return false;
  }
};

// Sync resources from all providers
const syncResources = async () => {
  console.log('Starting library sync...');
  
  // Load the last sync time
  const lastSyncTime = loadLastSyncTime();
  console.log(`Last sync time: ${lastSyncTime || 'Never'}`);
  
  // Sync resources from all providers
  try {
    const resources = await libraryApiManager.syncAllProviders(lastSyncTime);
    console.log(`Found ${resources.length} new resources`);
    
    // Limit the number of resources to process
    const resourcesToProcess = resources.slice(0, MAX_RESOURCES_PER_SYNC);
    console.log(`Processing ${resourcesToProcess.length} resources...`);
    
    // Convert and save resources
    let resourcesAdded = 0;
    for (const resource of resourcesToProcess) {
      try {
        // Convert external resource to internal resource format
        const internalResource = libraryApiManager.convertToInternalResource(resource);
        
        // Save to database via API
        await resourceAPI.createResource(internalResource);
        resourcesAdded++;
        
        // Log progress every 10 resources
        if (resourcesAdded % 10 === 0) {
          console.log(`Added ${resourcesAdded} resources so far...`);
        }
      } catch (error) {
        console.error(`Error adding resource "${resource.title}":`, error);
      }
    }
    
    // Save the sync log
    saveSyncLog(new Date().toISOString(), resourcesAdded);
    
    console.log(`Sync completed. Added ${resourcesAdded} resources.`);
    return resourcesAdded;
  } catch (error) {
    console.error('Error syncing resources:', error);
    return 0;
  }
};

// Main function
const main = async () => {
  console.log('Library sync script started');
  
  // Initialize the library API manager
  const initialized = await initializeLibraryManager();
  if (!initialized) {
    console.error('Failed to initialize library API manager. Exiting...');
    process.exit(1);
  }
  
  // Sync resources
  await syncResources();
  
  // If running as a daemon, set up interval
  if (process.argv.includes('--daemon')) {
    console.log(`Setting up sync interval: ${SYNC_INTERVAL}ms`);
    setInterval(syncResources, SYNC_INTERVAL);
  } else {
    process.exit(0);
  }
};

// Run the main function
main().catch(error => {
  console.error('Unhandled error in main function:', error);
  process.exit(1);
});