import React from 'react'
import styles from './UserPhotoPost.module.css'
import Input from './../Form/Input';
import Button from './../Form/Button';
import useForm from './../../Hooks/useForm';
import useFetch from './../../Hooks/useFetch';
import { PHOTO_POST } from '../../api';
import Error from './../Helper/Error';
import { useNavigate } from 'react-router-dom';
import Head from './../Helper/Head';

const UserPhotoPost = () => {
  const [img, setImg] = React.useState({});
  const nome = useForm();
  const peso = useForm('number');
  const idade = useForm('number');
  const {data, error, loading, request} = useFetch();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // qd o fetch e feito com sucesso, ele salva o json no data, logo o valor de data sempre muda quando tem exito
    if (data) navigate('/conta');
  }, [data, navigate]);

  function handleSubmit (e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('img', img.raw);
    formData.append('nome', nome.value);
    formData.append('peso', peso.value);
    formData.append('idade', idade.value);

    const token = window.localStorage.getItem('token');
    const {url, options} = PHOTO_POST(formData, token);
    request(url, options);
  };

  function hangleImgChange({target}) {
    setImg({
      preview: URL.createObjectURL(target.files[0]),
      raw: target.files[0],
    })
  }

  return (
    <section className={`${styles.photoPost} animeLeft`}>
        <Head title="Poste sua foto" />
      <form onSubmit={handleSubmit}>
        <Input  label="Nome" type="text" name="nome" {...nome}/>
        <Input  label="Peso" type="number" name="peso" {...peso}/>
        <Input  label="Idade" type="number" name="idade" {...idade}/>
        <input className={styles.file} type="file" name="img" id="img" onChange={hangleImgChange}/>
        {loading ?
        <Button disabled> Carregando... </Button>
        :
        <Button> Enviar </Button>}
        <Error error={error}/>
      </form>
      {img.preview && <div className={styles.preview} 
      style={{backgroundImage: `url('${img.preview}')`}}></div>}
    </section>
  )
}

export default UserPhotoPost;