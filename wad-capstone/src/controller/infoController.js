const getInfo = (req, res) => {
    try {
        return res.status(200).json({
            status: "success",
            message: "Server information retrieved successfully",
            data: {
                environment: process.env.NODE_ENV || "development",
                uptime: process.uptime(),
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = { getInfo };