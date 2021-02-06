const uploadFile = require("../middleware/upload");

exports.postImage = async (req, res, next) => {
    try {
        await uploadFile(req, res);
    
        console.log(req.file);

        if (req.file == undefined) {
            return res.status(400).json({ 
                ok: false,
                message: "Please upload a file!",
                data: []
            });
        }
    
        res.status(200).json({ 
            ok: true,
            message: "Uploaded the file successfully: " + req.file.originalname,
            data: req.file
        });

      } catch (err) {
        res.status(500).json({
            ok: false,
            message: `Could not upload the file`,
            data: ""
        });
    }
}