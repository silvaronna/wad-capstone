const getEcho = (req, res) => {
  try {
    const { msg } = req.params;

    return res.status(200).json({
      status: "success",
      message: "Echo response",
      data: {
        received: msg,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { getEcho };
