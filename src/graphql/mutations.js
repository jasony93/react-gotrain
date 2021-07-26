/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const updateInterestedList = /* GraphQL */ `
  mutation UpdateInterestedList(
    $input: UpdateInterestedListInput!
  ) {
    updateInterestedList(input: $input) {
      id
      list
    }
  }
`;

export const createInterestedInfo = /* GraphQL */ `
  mutation CreateInterestedInfo(
    $input: CreateInterestedInfoInput!
  ) {
    createInterestedInfo(input: $input) {
      id
      createdDate
      cutoffPrice
      port
      purchasePrice
      remarks
      soldDate
      soldPrice
      targetPrice
      targetProfit
      totalProfit
      weight
    }
  }
`;

export const updateInterestedInfo = /* GraphQL */ `
  mutation UpdateInterestedInfo(
    $input: UpdateInterestedInfoInput!
  ) {
    updateInterestedInfo(input: $input) {
      id
      createdDate
      cutoffPrice
      port
      purchasePrice
      remarks
      soldDate
      soldPrice
      targetPrice
      targetProfit
      totalProfit
      weight
    }
  }
`;

export const deleteInterestedInfo = /* GraphQL */ `
  mutation DeleteInterestedInfo(
    $input: DeleteInterestedInfoInput!
  ) {
    deleteInterestedInfo(input: $input) {
      id
    }
  }
`;