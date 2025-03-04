import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as subscriptions from '../graphql/subscriptions';
import { GraphQLResult } from '@aws-amplify/api';

// Type for GraphQL operation parameters
type GraphQLParams = {
  query: any;
  variables?: Record<string, any>;
};

// Generic function to execute GraphQL queries
export async function executeQuery<T>(params: GraphQLParams): Promise<T> {
  try {
    const result = await API.graphql(graphqlOperation(params.query, params.variables)) as GraphQLResult<T>;
    if (result.errors) {
      throw new Error(result.errors.map(e => e.message).join('\n'));
    }
    return result.data as T;
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
}

// Institution API functions
export const institutionAPI = {
  getInstitution: async (id: string) => {
    return executeQuery({
      query: queries.GET_INSTITUTION,
      variables: { id }
    });
  },
  
  listInstitutions: async (filter?: any, limit?: number, nextToken?: string) => {
    return executeQuery({
      query: queries.LIST_INSTITUTIONS,
      variables: { filter, limit, nextToken }
    });
  },
  
  createInstitution: async (input: any) => {
    return executeQuery({
      query: mutations.CREATE_INSTITUTION,
      variables: { input }
    });
  },
  
  updateInstitution: async (input: any) => {
    return executeQuery({
      query: mutations.UPDATE_INSTITUTION,
      variables: { input }
    });
  },
  
  deleteInstitution: async (id: string ) => {
    return executeQuery({
      query: mutations.DELETE_INSTITUTION,
      variables: { id }
    });
  },
  
  onCreateInstitution: () => {
    return API.graphql(graphqlOperation(subscriptions.ON_CREATE_INSTITUTION));
  },
  
  onUpdateInstitution: () => {
    return API.graphql(graphqlOperation(subscriptions.ON_UPDATE_INSTITUTION));
  },
  
  onDeleteInstitution: () => {
    return API.graphql(graphqlOperation(subscriptions.ON_DELETE_INSTITUTION));
  }
};

// User API functions
export const userAPI = {
  getUser: async (id: string) => {
    return executeQuery({
      query: queries.GET_USER,
      variables: { id }
    });
  },
  
  listUsers: async (filter?: any, limit?: number, nextToken?: string) => {
    return executeQuery({
      query: queries.LIST_USERS,
      variables: { filter, limit, nextToken }
    });
  },
  
  createUser: async (input: any) => {
    return executeQuery({
      query: mutations.CREATE_USER,
      variables: { input }
    });
  },
  
  updateUser: async (input: any) => {
    return executeQuery({
      query: mutations.UPDATE_USER,
      variables: { input }
    });
  },
  
  deleteUser: async (id: string) => {
    return executeQuery({
      query: mutations.DELETE_USER,
      variables: { id }
    });
  }
};

// Resource API functions
export const resourceAPI = {
  getResource: async (id: string) => {
    return executeQuery({
      query: queries.GET_RESOURCE,
      variables: { id }
    });
  },
  
  listResources: async (filter?: any, limit?: number, nextToken?: string) => {
    return executeQuery({
      query: queries.LIST_RESOURCES,
      variables: { filter, limit, nextToken }
    });
  },
  
  createResource: async (input: any) => {
    return executeQuery({
      query: mutations.CREATE_RESOURCE,
      variables: { input }
    });
  },
  
  updateResource: async (input: any) => {
    return executeQuery({
      query: mutations.UPDATE_RESOURCE,
      variables: { input }
    });
  },
  
  deleteResource: async (id: string) => {
    return executeQuery({
      query: mutations.DELETE_RESOURCE,
      variables: { id }
    });
  }
};

// Course API functions
export const courseAPI = {
  getCourse: async (id: string) => {
    return executeQuery({
      query: queries.GET_COURSE,
      variables: { id }
    });
  },
  
  listCourses: async (filter?: any, limit?: number, nextToken?: string) => {
    return executeQuery({
      query: queries.LIST_COURSES,
      variables: { filter, limit, nextToken }
    });
  },
  
  createCourse: async (input: any) => {
    return executeQuery({
      query: mutations.CREATE_COURSE,
      variables: { input }
    });
  },
  
  updateCourse: async (input: any) => {
    return executeQuery({
      query: mutations.UPDATE_COURSE,
      variables: { input }
    });
  },
  
  deleteCourse: async (id: string) => {
    return executeQuery({
      query: mutations.DELETE_COURSE,
      variables: { id }
    });
  }
};