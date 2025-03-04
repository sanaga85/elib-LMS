import { gql } from 'graphql-tag';

// Institution Subscriptions
export const ON_CREATE_INSTITUTION = gql`
  subscription OnCreateInstitution {
    onCreateInstitution {
      id
      name
      logo
      primaryColor
      secondaryColor
      domain
      active
      createdAt
      updatedAt
      description
      address
      phone
      email
      website
      foundedYear
    }
  }
`;

export const ON_UPDATE_INSTITUTION = gql`
  subscription OnUpdateInstitution {
    onUpdateInstitution {
      id
      name
      logo
      primaryColor
      secondaryColor
      domain
      active
      createdAt
      updatedAt
      description
      address
      phone
      email
      website
      foundedYear
    }
  }
`;

export const ON_DELETE_INSTITUTION = gql`
  subscription OnDeleteInstitution {
    onDeleteInstitution {
      id
    }
  }
`;

// User Subscriptions
export const ON_CREATE_USER = gql`
  subscription OnCreateUser {
    onCreateUser {
      id
      email
      firstName
      lastName
      role
      institutionId
      createdAt
      updatedAt
    }
  }
`;

export const ON_UPDATE_USER = gql`
  subscription OnUpdateUser {
    onUpdateUser {
      id
      email
      firstName
      lastName
      role
      institutionId
      createdAt
      updatedAt
    }
  }
`;

export const ON_DELETE_USER = gql`
  subscription OnDeleteUser {
    onDeleteUser {
      id
    }
  }
`;

// Resource Subscriptions
export const ON_CREATE_RESOURCE = gql`
  subscription OnCreateResource {
    onCreateResource {
      id
      title
      description
      type
      url
      thumbnailUrl
      author
      publishedDate
      categories
      tags
      institutionId
      rating
      bookmarks
      featured
      createdBy
      createdAt
      updatedAt
      downloadUrl
      offlineAvailable
      fileSize
    }
  }
`;

export const ON_UPDATE_RESOURCE = gql`
  subscription OnUpdateResource {
    onUpdateResource {
      id
      title
      description
      type
      url
      thumbnailUrl
      author
      publishedDate
      categories
      tags
      institutionId
      rating
      bookmarks
      featured
      createdBy
      createdAt
      updatedAt
      downloadUrl
      offlineAvailable
      fileSize
    }
  }
`;

export const ON_DELETE_RESOURCE = gql`
  subscription OnDeleteResource {
    onDeleteResource {
      id
    }
  }
`;

// Course Subscriptions
export const ON_CREATE_COURSE = gql`
  subscription OnCreateCourse {
    onCreateCourse {
      id
      title
      description
      institutionId
      facultyId
      enrolledStudents
      resources
      createdAt
      updatedAt
      startDate
      endDate
      thumbnail
      status
    }
  }
`;

export const ON_UPDATE_COURSE = gql`
  subscription OnUpdateCourse {
    onUpdateCourse {
      id
      title
      description
      institutionId
      facultyId
      enrolledStudents
      resources
      createdAt
      updatedAt
      startDate
      endDate
      thumbnail
      status
    }
  }
`;

export const ON_DELETE_COURSE = gql`
  subscription OnDeleteCourse {
    onDeleteCourse {
      id
    }
  }
`;