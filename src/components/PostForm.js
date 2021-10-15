import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";

import { useForm } from "../util/hooks";
import { CREATE_POST_MUTATION, FETCH_POSTS_QUERY } from "../util/graphql";
import { UploadImage } from "./UploadImage";
import "./PostForm.css";
import CloseIcon from "@mui/icons-material/Close";
import InsertPhotoOutlined from "@mui/icons-material/InsertPhotoOutlined";

function PostForm() {
  const [deleteToken, setDeleteToken] = useState("");
  const [media, setMedia] = useState("none");

  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
    media: "none",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: { ...values, media: media.url || "" },
    update(proxy, result) {
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
    },
  });

  function createPostCallback() {
    createPost();
  }

  const deleteImage = async () => {
    try {
      const formData = new FormData();
      formData.append("upload_preset", "my_preset");
      formData.append("token", deleteToken);
      await fetch(`https://api.cloudinary.com/v1_1/ducwniw5l/delete_by_token`, {
        method: "POST",
        body: formData,
      });
      setDeleteToken("");
      setMedia("none");
    } catch (error) {
      console.log(error);
      setDeleteToken("");
      setMedia("none");
    }
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="What's on your mind?"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          {media && media !== "none" && (
            <div className="mediaName">
              <InsertPhotoOutlined />
              <p>{media.fileName}</p>
              <CloseIcon className="closeIcon" onClick={deleteImage} />
            </div>
          )}
          <div className="createPostForm">
            <UploadImage setDeleteToken={setDeleteToken} setMedia={setMedia} />
            <Button type="submit" color="teal">
              Submit
            </Button>
          </div>
        </Form.Field>
      </Form>
      {error && console.log(error) && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default PostForm;
