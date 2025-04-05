const subjectSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    exam: {
      type: String, 
    },
    syllabus: [
      {
        unit: {
          type: String,
          required: true,
        },
        topics: [
          {
            topic: {
              type: String,
              required: true,
            },
            subtopics: [String],
          },
        ],
      },
    ],
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  