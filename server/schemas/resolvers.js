const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({
					_id: context.user._id,
				})
					.select('-__v -password')
					.populate('savedBooks');

				return userData;
			}

			throw new AuthenticationError('Not logged in');
		},
	},

	Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError(
					'Incorrect credentials'
				);
			}

			const correctPw = await user.isCorrectPassword(
				password
			);

			if (!correctPw) {
				throw new AuthenticationError(
					'Incorrect credentials'
				);
			}

			const token = signToken(user);
			return { token, user };
		},
		saveBook: async (parent, { bookData }, context) => {
			if (context.book) {
				const updatedBook = await Book.findOneAndUpdate(
					{ _id: context.user._id },
					{ $push: { savedBooks: bookData } },
					{ new: true, runValidators: true }
				);
				console.log(updatedBook);
				return updatedBook;
			}
		},
		removeBook: async (
			parent,
			{ bookId, reactionBody },
			context
		) => {
			if (context.book) {
				const deleteBook = await Book.findOne({
					_id: bookId,
				});

				delete deleteBook;

				return savedBooks;
			}
		},
	},
};

module.exports = resolvers;
