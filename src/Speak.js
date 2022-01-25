import React, { useEffect, useState, useRef } from "react";
import ReactAudioPlayer from "react-audio-player";
import "./Speak.css";
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./firebase/auth";
import { collection, setDoc, doc, serverTimestamp } from "@firebase/firestore";
import { useAuthContext } from './context/AuthProvider';

const Speak = () => {
    const { user } = useAuthContext();
    const [file, setFile] = useState([]);
    const [audioState, setAudioState] = useState(true);
    const audioRef = useRef();


    useEffect(() => {
        // if (firebase.apps.length === 0) {
        //     console.log("あ")
        //     firebase.initializeApp(firebaseConfig);
        // }
        // マイクへのアクセス権を取得
        navigator.getUserMedia =
            navigator.getUserMedia || navigator.webkitGetUserMedia;
        //audioのみtrue
        navigator.getUserMedia(
            {
                audio: true,
                video: false,
            },
            handleSuccess,
            hancleError
        );
    }, []);

    const handleSuccess = (stream) => {
        // レコーディングのインスタンスを作成
        audioRef.current = new MediaRecorder(stream, {
            mimeType: "video/webm;codecs=vp9",
        });
        // 音声データを貯める場所
        const chunks = [];
        // 録音が終わった後のデータをまとめる
        audioRef.current.addEventListener("dataavailable", (ele) => {
            if (ele.data.size > 0) {
                chunks.push(ele.data);
            }
            // 音声データをセット
            setFile(chunks);
        });
        // 録音を開始したら状態を変える
        audioRef.current.addEventListener("start", () => setAudioState(false));
        // 録音がストップしたらchunkを空にして、録音状態を更新
        audioRef.current.addEventListener("stop", () => {
            setAudioState(true);
            chunks = [];
        });
    };
    // 録音開始
    const handleStart = () => {
        audioRef.current.start();
    };

    // 録音停止
    const handleStop = () => {
        audioRef.current.stop();
    };
    // firebaseに音声ファイルを送信
    const handleSubmit = async() => {
        const docRef = doc(collection(db, "posts"))
        console.log(firebase)
        // firebaseのrefを作成
        const storageRef = ref(storage, `audio/${docRef.id}.mp3`);
        console.log("確認")
        const metadata = {
            contentType: "audio/mp3",
        };
        // ファイル名を付けてBlobからファイルを作成して送信
        // const mountainsRef = storageRef.child(new Date() + "test.mp3");
        // mountainsRef.put(new Blob(file), metadata).then(function () {
        //     console.log("アップロード完了！");
        // });
        const uploadAudioTask = await uploadBytesResumable(storageRef, new Blob(file), metadata)
        uploadAudioTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                // getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                //     await setDoc(docRef, {
                //         audio: downloadURL,
                //         name: user.email,
                //         title: "Japan",
                //         uid: auth.currentUser.uid,
                //         createdAt: serverTimestamp()
                //     });
                //     console.log('File available at', downloadURL);
                // });
            }
        );
        // firebaseのrefを作成
        const thumbnailStorageRef = ref(storage, `thumbnail/${docRef.id}.jpeg`);
        // ファイル名を付けてBlobからファイルを作成して送信
        // const mountainsRef = storageRef.child(new Date() + "test.mp3");
        // mountainsRef.put(new Blob(file), metadata).then(function () {
        //     console.log("アップロード完了！");
        // });
        const uploadThumbnailTask = await uploadBytesResumable(thumbnailStorageRef, new Blob())
        uploadThumbnailTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            // () => {
            //     // Handle successful uploads on complete
            //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            //     getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            //         await setDoc(docRef, {
            //             audio: downloadURL,
            //             name: user.email,
            //             title: "Japan",
            //             uid: auth.currentUser.uid,
            //             createdAt: serverTimestamp()
            //         });
            //         console.log('File available at', downloadURL);
            //     });
            // }

        );
        const audioURL = await getDownloadURL(uploadAudioTask.snapshot.ref)
        const thumbnailURL = await getDownloadURL(uploadThumbnailTask.snapshot.ref)
        await setDoc(docRef, {
            thumbnail: thumbnailURL,
            audio: audioURL,
            name: user.email,
            title: "Japan",
            uid: auth.currentUser.uid,
            createdAt: serverTimestamp()
        });
    };
    const handleRemove = () => {
        setAudioState(true);
        setFile([]);
    };

    const hancleError = () => {
        alert("エラーです。");
    };


    return (
        <div className="Speak">
            <input type="file" accept="image/png, image/jpeg"/>
            <button onClick={handleStart}>録音</button>
            <button onClick={handleStop} disabled={audioState}>
                ストップ
            </button>
            <button onClick={handleSubmit} disabled={file.length === 0}>
                送信
            </button>
            <button onClick={handleRemove}>削除</button>
            <ReactAudioPlayer src={URL.createObjectURL(new Blob(file))} controls />
        </div>
    );
};


export default Speak;
