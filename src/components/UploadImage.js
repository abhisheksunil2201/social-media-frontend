import { useDropzone } from "react-dropzone";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export const UploadImage = ({ setDeleteToken, setMedia }) => {
  const [open, setOpen] = useState(false);
  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    const file = acceptedFiles[0];
    formData.append("file", file);
    formData.append("upload_preset", "my_preset");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/ducwniw5l/image/upload/`,
      {
        method: "POST",
        body: formData,
      }
    );
    const res = await response.json();
    setDeleteToken(res.delete_token);
    setMedia({ fileName: res.original_filename, url: res.url });
    setOpen(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/jpeg, image/png, image/gif, image/jpg",
    maxSize: 1e7,
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "1rem",
    p: 15,
  };

  return (
    <>
      <InsertPhotoOutlinedIcon
        style={{ fontSize: "3rem" }}
        onClick={() => setOpen(true)}
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={style} {...getRootProps()}>
          <input {...getInputProps()} />

          <Box sx={style}>
            {isDragActive ? (
              <Typography>Drag the files here...</Typography>
            ) : (
              <Typography>
                Drag and drop images here, or click to select
              </Typography>
            )}
          </Box>
        </div>
      </Modal>
    </>
  );
};
