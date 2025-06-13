import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testType: {
      type: String,
      required: true,
    },
    testName: String,
    request: {
      name: String,
      method: String,
      url: String,
      body: mongoose.Schema.Types.Mixed,
      headers: {
        type: Map,
        of: String,
        default: {},
      },
    },
    response: {
      status: String,
      data: mongoose.Schema.Types.Mixed,
      duration: String,
      isSuccess: Boolean,
      warnings: mongoose.Schema.Types.Mixed,
      errorSummary: {
        type: String,
        default: null,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("History", historySchema);
