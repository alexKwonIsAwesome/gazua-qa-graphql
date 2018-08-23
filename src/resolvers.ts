export const resolvers = {
  Query: {
    async questions(root, args, context, info) {
      try {
        let { offset, limit, answers } = args;
        if (offset < 0 || limit < 0) {
          throw new Error('offset or limit should be positive integer');
        }

        let query = context.db.collection('questions')
          .orderBy('updatedAt', 'desc')
          .offset(offset)
          .limit(limit)

        if (answers === 'none') {
          query = query.where('answersLength', '==', 0);
        }

        const questionSnapshots = await query.get();
        return questionSnapshots.docs.map((snapshot) => {
          return snapshot.data();
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    async question(root, args, context, info) {
      try {
        const { id } = args;
        const questionSnapshot = await context.db.collection('questions').doc(id).get();
        return questionSnapshot.data();
      } catch (e) {
        throw new Error(e);
      }
    }
  },
  Mutation: {
    async addQuestion(root, args, context, info) {
      try {
        const { question, contents } = args;
        const time = context.Firestore.FieldValue.serverTimestamp();
        const newQuestionRef = context.db.collection('questions').doc();
        await newQuestionRef.set({
          id: newQuestionRef.id,
          question,
          contents,
          answersLength: 0,
          createdAt: time,
          updatedAt: time,
        });
        const newQuestionSnapshot = await newQuestionRef.get();
        return newQuestionSnapshot.data();
      } catch (e) {
        throw new Error(e);
      }
    },
    async addAnswer(root, args, context, info) {
      try {
        const { questionId, contents } = args;
        const time = context.Firestore.FieldValue.serverTimestamp();

        // add new answer doc
        const newAnswerRef = context.db.collection('answers').doc();
        await newAnswerRef.set({
          id: newAnswerRef.id,
          contents,
          questionId,
          createdAt: time,
          updatedAt: time,
        });

        // add answer doc id to questions.answers
        const questionRef = context.db.collection('questions').doc(questionId);
        const questionSnapshot = await questionRef.get();
        await questionRef.update({
          answersLength: questionSnapshot.data().answersLength + 1,
        });

        const newAnswerSnapshot = await newAnswerRef.get();
        return newAnswerSnapshot.data();
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Question: {
    async createdAt(root, args, context, info) {
      try {
        return root.createdAt.toMillis();
      } catch (e) {
        throw new Error(e);
      }
    },
    async updatedAt(root, args, context, info) {
      try {
        return root.updatedAt.toMillis();
      } catch (e) {
        throw new Error(e);
      }
    },
    async answers(root, args, context, info) {
      try {
        const answerSnapshots = await context.db.collection('answers')
          .where('questionId', '==', root.id)
          .orderBy('updatedAt', 'asc')
          .get();
        return answerSnapshots.docs.map((snapshot) => {
          return snapshot.data();
        });
      } catch (e) {
        throw new Error(e);
      }
    },
    async answerLength(root, args, context, info) {
      try {
        const answerSnapshots = await context.db.collection('answers').where('questionId', '==', root.id).get();
        return answerSnapshots.docs.length;
      } catch (e) {
        throw new Error(e);
      }
    }
  },
  Answer: {
    async createdAt(root, args, context, info) {
      try {
        return root.createdAt.toMillis();
      } catch (e) {
        throw new Error(e);
      }
    },
    async updatedAt(root, args, context, info) {
      try {
        return root.updatedAt.toMillis();
      } catch (e) {
        throw new Error(e);
      }
    },
  }
};