import { getDoc, doc } from 'firebase/firestore';
import { onNavigate } from '../router';
import { db, auth, createPost } from '../lib/fireBase.js';

export const post = () => {
  const postSection = document.createElement('section');
  postSection.className = 'postSection';
  const logoPost = document.createElement('img');
  logoPost.className = 'logoPost';
  logoPost.src = './img/logo.png';

  const articlePost = document.createElement('article');
  articlePost.className = 'articlePost';
  const userImg = document.createElement('img');
  userImg.className = 'userImg';
  const nameUser = document.createElement('h6');
  nameUser.className = 'nameUser';
  const textArea = document.createElement('textarea');
  textArea.name = 'textarea';
  textArea.rows = '10';
  textArea.cols = '50';
  textArea.className = 'inpPost';
  textArea.placeholder = 'What would you like to share?';

  const btnCancelPost = document.createElement('button');
  btnCancelPost.className = 'btnCancelPost';
  btnCancelPost.textContent = 'CANCEL';
  const btnCreatePost = document.createElement('button');
  btnCreatePost.className = 'btnCreatePost';
  btnCreatePost.textContent = 'POST';

  articlePost.appendChild(userImg);
  articlePost.appendChild(nameUser);
  articlePost.appendChild(btnCancelPost);
  articlePost.appendChild(btnCreatePost);
  articlePost.appendChild(textArea);

  postSection.appendChild(logoPost);
  postSection.appendChild(articlePost);

  btnCancelPost.addEventListener('click', () => onNavigate('/feed'));

  const user = auth.currentUser;
  if (user !== null) {
    user.providerData.forEach(async (profile) => {
      const photo = profile.photoURL;
      userImg.src = photo;
      const name = profile.displayName;
      nameUser.textContent = name;
      if (photo === null) {
        userImg.src = './img/user.png';
      }
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      // console.log('snap',user)
      if (docSnap.exists()) {
        const nameF = docSnap.data().displayName;
        nameUser.textContent = nameF;
      }
    });
  }
  btnCreatePost.addEventListener('click', (e) => {
    e.preventDefault();
    createPost(textArea.value)
      .then(() => {
        onNavigate('/feed');
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
      });
  });
  return postSection;
};