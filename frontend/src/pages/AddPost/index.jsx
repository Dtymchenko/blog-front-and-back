import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from "../../helpers/axios"

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const [text, setText] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const inputFileRef = React.useRef(null)
  const [loading, setLoading] = React.useState(false)
  const isEditing = Boolean(id)

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData()
      const file = e.target.files[0]
      formData.append("image", file)
      const {data} = await axios.post("/upload", formData)
      setImageUrl(data.url)
    } catch (error) {
      console.warn(error)
      alert("Error in loading file")
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("")
  };

  const onChange = React.useCallback((text) => {
    setText(text);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true)
      const fields = {
        title,
        imageUrl,
        text,
        tags: tags.replace(/ /g, '').split(",")
      }
      const {data} = isEditing
      ? await axios.patch(`/posts/${id}`, fields)
      : await axios.post("/posts", fields)

      const _id = isEditing ? id : data._id

      navigate(`/posts/${_id}`)
    } catch (error) {
      console.warn(error)
      alert(error.message)
    }
  }

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({data}) => {
        setTitle(data.title)
        setText(data.text)
        setImageUrl(data.imageUrl)
        setTags(data.tags.join(","))
      }).catch(error => {
        console.warn(error)
        alert("Error to get post")
      })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Load image
      </Button>
      <input type="file" onChange={handleChangeFile} hidden ref={inputFileRef} />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Remove
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField classes={{ root: styles.tags }} variant="standard" placeholder="Tags" value={tags}
        onChange={e => setTags(e.target.value)} fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Save" : "Publish"}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
