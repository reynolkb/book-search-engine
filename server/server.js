// const express = require('express');
// const path = require('path');
// const db = require('./config/connection');
// const routes = require('./routes');

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
// 	app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

// db.once('open', () => {
// 	app.listen(PORT, () =>
// 		console.log(`🌍 Now listening on localhost:${PORT}`)
// 	);
// });

// ----------------- askBCS -------------------------
// import connect from 'connect';
// import bodyParser from 'body-parser';
// import { graphqlConnect } from 'apollo-server-express';
// import http from 'http';

// const PORT = 3000;

// const app = connect();

// // bodyParser is needed just for POST.
// app.use('/graphql', bodyParser.json());
// app.use('/graphql', graphqlConnect({ schema: myGraphQLSchema }));

// http.createServer(app).listen(PORT);

// // bodyParser is needed just for POST.
// app.use('/graphql', bodyParser.json());
// app.use('/graphql', graphqlConnect({ schema: myGraphQLSchema }));

const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
	app.listen(PORT, () => {
		console.log(`API server running on port ${PORT}!`);
		// log where we can go to test our GQL API
		console.log(
			`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
		);
	});
});
