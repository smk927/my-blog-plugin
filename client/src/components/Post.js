import React from "react";

const Post = ({ title, content }) => {
    return (
        <div>
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    );
};

export default Post;
