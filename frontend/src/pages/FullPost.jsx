import React from "react";
import axios from "../helpers/axios"

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { useParams } from "react-router-dom";
import { formatDate } from "../helpers/functions";
import ReactMarkdown from 'react-markdown';

export const FullPost = () => {

  const [data, setData] = React.useState()
  const [isLoading, setIsLoading] = React.useState(true)
  const { id } = useParams()

  React.useEffect(() => {
    try {
      const getArticle = async () => {
        const res = await axios.get(`/posts/${id}`)
        setData(res.data)
        setIsLoading(false)
      }
      getArticle()
    } catch (error) {
      console.log(error)
      alert("Error in getting article")
    }

  }, [])

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />
  }
  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        user={data.user}
        createdAt={formatDate(data.createdAt)}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text}/>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: "User1",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Test comment 555555",
          },
          {
            user: {
              fullName: "User2",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
