import History from "../models/historyModel.js";

export const saveHistory = async (req, res) => {
  try {
    const { testType, testName, request, response } = req.body;

    const newHistory = new History({
      user: req.id,
      testType,
      testName,
      request: {
        ...request,
        headers: request.headers || {},
      },
      response: {
        ...response,
        warning: response.warning || null,
        errorSummary: response.errorSummary,
      },
    });

    await newHistory.save();

    res.status(201).json({ message: "History saved" });
  } catch (error) {
    console.error("Save History Error:", error);
    res.status(500).json({ message: "Error saving history", error });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(history);
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ message: "Error fetching history", error });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const history = await History.findOne({
      _id: req.params.id,
      user: req.id,
    });

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.body;

    const history = await History.findByIdAndDelete(id);
    if (!history) {
      return res.status(404).json({ message: "History Not Found" });
    }
    res.status(200).json({ message: "History Deleted Successfully" });
  } catch (error) {
    console.error("Delete History Error:", error);
    res.status(500).json({ message: "Error Deleting history", error });
  }
};
