// SET UP DATABASE

    // Require Mongoose (mongoose.connect and mongoose.connection) to establish a connection with the database
    const mongoose = require('mongoose');

    // Establish connection with the database
    const connection = mongoose.connection;
    mongoose.connect('mongodb://localhost/todos', { useNewUrlParser: true });

    // Confirm that the connection has been established successfully
    connection.once('open', () => {
    console.log('Database successfully connected')
    });

// SET UP SCHEMAS & QUERIES

    // Set up data model

    const Todo = mongoose.model('Todo', {
        text: String,
        complete: Boolean
    });

    // Set up queries schema

    const typeDefs = `
        type Query {
            todos: [Todo]
        }

        type Todo {
            id: ID!
            text: String!
            complete: Boolean!
        }

        type Mutation {
            createTodo(text:String!): Todo
            toggleTodo(id:ID!, complete:Boolean): Todo
            removeTodo(id:ID!): Boolean
        }
    `;

    // Set up queries

    const resolvers = {
        Query: {
            todos: () => Todo.find()
        },
        Mutation: {
            createTodo: async (_, { text }) => {
                const todo = new Todo({ text, complete: false});
                await todo.save();
                return todo
            },
            toggleTodo: async (_, { id, complete }) => {
                const todo = Todo.findById(id);
                await Todo.findByIdAndUpdate(id, { complete }, {useFindAndModify:false});
                return todo
            },
            removeTodo: async (_, {id}) => {
                await Todo.findByIdAndRemove(id, {useFindAndModify:false});
                return true
            }
        }
    };


// SET UP SERVER

    // Require GraphQL

    const { GraphQLServer } = require('graphql-yoga');

    // Generate a new instance of a GraphQL server passing the queries and queries schemas
    const server = new GraphQLServer ({ typeDefs, resolvers });

    // Set up PORT
    const PORT = process.env.PORT || 4000;

    // Confirm that the server is running and on the right PORT
    server.start(() => console.log('Server listening on PORT: ' + PORT));