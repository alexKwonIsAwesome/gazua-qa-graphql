export const resolvers = {
  Query: {
    async questions(root, args, context, info) {
      try {
        const questionSnapshots = await context.db.collection('questions').get();
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
        const questionDoc = await context.db.collection('questions').doc(id).get();
        return questionDoc.data();
      } catch (e) {
        throw new Error(e);
      }
    },
    async answers(root, args, context, info) {
      try {
        const answerSnapshots = await context.db.collection('answers').get();
        return answerSnapshots.docs.map((snapshot) => {
          return snapshot.data();
        });
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
        const newAnswerRef = context.db.collection('answers').doc();
        await newAnswerRef.set({
          id: newAnswerRef.id,
          contents,
          questionId,
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
        const answerSnapshots = await context.db.collection('answers').where('questionId', '==', root.id).get();
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

  }
};