import React from 'react';

// Import gql to be able to parse gql queries
import { gql } from "apollo-boost";

// Import GraphQL to be able to grab all todos with a GraphQL query
import { graphql, compose } from 'react-apollo';

// Import paper for some google-like styling
import Paper from '@material-ui/core/Paper';

// Importing google material list styles
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// Import addTodo React form
import CreateTodo from './createTodo';

// Grab all todos with a GraphQL query
const TodosQuery = gql`
  query {
    todos {
      id
      text
      complete
    }
  }
`;

// Modify todos with a GraphQL query
const toggleMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    toggleTodo (id: $id, complete: $complete) {
      id
      text
      complete
    }
  }
`;

const removeMutation = gql`
  mutation($id: ID!) {
    removeTodo (id: $id)
  }
`;

const createMutation = gql`
  mutation($text: String!) {
    createTodo (text: $text) {
      id
      text
      complete
    }
  }
`;

class App extends React.Component {
  // Setting up even handlers for google todo list
  toggleTodo = async todo => {
    await this.props.toggleTodo({
      variables: {
        id: todo.id,
        complete: !todo.complete
      }
    })
  }
  
  removeTodo = async todo => {
    await this.props.removeTodo({
      variables: {
        id: todo.id
      },
      update: store => {
        const data = store.readQuery({query: TodosQuery});
        data.todos = data.todos.filter(x => x.id !== todo.id);
        store.writeQuery({ query: TodosQuery, data})
      }
    })
  }
  
  createTodo = async text => {
    await this.props.createTodo({
      variables: {
        text,
      },
      update: (store, {data: {createTodo}}) => {
        const data = store.readQuery({query: TodosQuery});
        data.todos.unshift(createTodo);
        store.writeQuery({ query: TodosQuery, data})
      }
    })
  }

  render() {
    // Save props in a constant to be able to pass them to the return statement
    const {
      data: {loading, todos}
    } = this.props;

    // If loading???
    if(loading) {
      return null
    }
    // Return todos
    return (
      <div style={{ display: 'flex'}}>
        <div style={{margin: 'auto', width: 400}}>
          <Paper elevation={2}>
            <div style={{ margin: 'auto', width: 370 }}>
              <CreateTodo submit={this.createTodo}/>
            </div>
            <List >
                {/* Give me a todo for each todo you find in the database and assign to it a unique key */}
                {todos.map(todo => (
                  <ListItem onClick={ () => this.toggleTodo(todo) }
                    key={todo.id} 
                    role={undefined} 
                    dense 
                    button >
                    <ListItemIcon>
                      <Checkbox 
                        edge="start"
                        checked={todo.complete}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText primary={todo.text} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={ () => this.removeTodo(todo) }>
                        <CloseIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(createMutation, {name: 'createTodo'}), 
  graphql(removeMutation, {name: 'removeTodo'}), 
  graphql(toggleMutation, {name: 'toggleTodo'}), 
  graphql(TodosQuery)
  )(App);


