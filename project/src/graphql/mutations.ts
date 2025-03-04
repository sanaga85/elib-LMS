import { gql } from 'graphql-tag';

// Institution Mutations
export const CREATE_INSTITUTION = gql`
  mutation CreateInstitution($input: CreateInstitutionInput!) {
    createInstitution(input: $input) {
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

export const UPDATE_INSTITUTION = gql`
  mutation UpdateInstitution($input: UpdateInstitutionInput!) {
    updateInstitution(input: $input) {
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

export const DELETE_INSTITUTION = gql`
  mutation DeleteInstitution($id: ID!) {
    deleteInstitution(id: $id) {
      id
    }
  }
`;

// User Mutations
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
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

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

// Resource Mutations
export const CREATE_RESOURCE = gql`
  mutation CreateResource($input: CreateResourceInput!) {
    createResource(input: $input) {
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

export const UPDATE_RESOURCE = gql`
  mutation UpdateResource($input: UpdateResourceInput!) {
    updateResource(input: $input) {
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

export const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id) {
      id
    }
  }
`;

// Course Mutations
export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
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

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($input: UpdateCourseInput!) {
    updateCourse(input: $input) {
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

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      id
    }
  }
`;