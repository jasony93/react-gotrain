/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getInterestedList = /* GraphQL */ `
  query GetInterestedList($id: String!) {
    getInterestedList(id: $id){
      list
    }
  }
`;

export const getInterestedInfo = /* GraphQL */ `
  query GetInterestedInfo($id: String!) {
    getInterestedInfo(id: $id){
      createdDate
      cutoffPrice
      port
      purchasePrice
      remarks
      soldDate
      targetPrice
      targetProfit
      totalProfit
      weight
    }
  }
`;
