import { gql } from 'graphql-tag';

// Institution Queries
export const GET_INSTITUTION = gql`
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
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

export const LIST_INSTITUTIONS = gql`
  query ListInstitutions($filter: InstitutionFilterInput, $limit: Int, $nextToken: String) {
    listInstitutions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

// User Queries
export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
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

export const LIST_USERS = gql`
  query ListUsers($filter: UserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        firstName
        lastName
        role
        institutionId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

// Resource Queries
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    getResource(id: $id) {
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

export const LIST_RESOURCES = gql`
  query ListResources($filter: ResourceFilterInput, $limit: Int, $nextToken: String) {
    listResources(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;

// Course Queries
export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
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

export const LIST_COURSES = gql`
  query ListCourses($filter: CourseFilterInput, $limit: Int, $nextToken: String) {
    listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;