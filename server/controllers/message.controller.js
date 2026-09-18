const { Message } = require("./../models");

const AVAILABLE_ROOMS = ["general", "frontend", "backend"];

module.exports.getMessages = async (req, res, next) => {
  try {
    const { roomId = "general", limit: requestedLimit } = req.query;

    if (!AVAILABLE_ROOMS.includes(roomId)) {
      return res.status(400).send({
        message: "Unknown room",
      });
    }

    const parsedLimit = Number.parseInt(requestedLimit, 10);

    const limit =
      Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 100)
        : 30;

    const messages = await Message.find({
      roomId,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).send({
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};
