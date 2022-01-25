import React, { useEffect, useState } from 'react'
import { collection, query, getDocs } from "firebase/firestore";
import { db } from './firebase/auth';
import { useAuthContext } from './context/AuthProvider';

function Home() {
    const [data, setData] = useState([])

    const { user } = useAuthContext();

    console.log(user);

    useEffect(() => {
        const getPosts = async () => {
            const q = query(collection(db, "posts"));

            const querySnapshot = await getDocs(q);
            const array = []
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                array.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            console.log(array);
            setData(array)
        }
        getPosts()

    }, [])
    return (
        <div className="home">
            {/* 親要素にkeyが必要。かぶってはだめ */}
            {data.map((x) => <div key={x.id}>
                <div>{x.name}</div>
                <audio src={x.audio} controls />
            </div>)}
        </div>
    )
}

export default Home
