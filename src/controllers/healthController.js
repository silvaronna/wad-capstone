const getHealth = (req, res) => {
  const io = req.app.get("io");
  res.status(200).json({
    status: "ok",
    socketIO: !!io,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getHealth };

