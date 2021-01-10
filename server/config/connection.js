const mongoose = require('mongoose');

mongoose.connect(
	'mongodb+srv://kyle:password123kyle@cluster0.6hea2.mongodb.net/book-search-engine?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: true,
	}
);

module.exports = mongoose.connection;
