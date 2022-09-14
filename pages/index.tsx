import { useState } from 'react'
import {GetServerSideProps} from 'next'
import {prisma} from '../lib/prisma'
import { useRouter } from 'next/router'


interface Notes {
  notes:{
    id:string
    title:string
    content:string
  }[]
}

interface FormData {
  title: string
  content: string
  id: string
}


const Home = ({notes}:Notes) => {
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
  }
  const [form,setForm] = useState<FormData>({
    title:"",
    content:"",
    id:"",
  });
  async  function create(data:FormData){
    if (data.title === "" || data.content === "" ){
      return alert("Please Put Correct informtion")
    }
    try {
      fetch('http://localhost:3001/api/create',{
        body : JSON.stringify(data),
        headers:{
          'Content-Type': 'application/json'
        },
        method:'POST',
      }).then(()=> {setForm({
        title:"",content:"",id:"",
        
      })
      refreshData()
    
    })
    } catch (error) {
      console.log("ERROR IN INDEX.TSX CREATE",error);
      
    }
  }

  const handleSubmit = async (data:FormData) => {
    if (!data){
      return alert("Please select a valid form data");
    }
  try {
    create(data)
    console.log(data)
  } catch (error) {
    console.log("ERROR IN INDEX.TSX HANDLE SUBMIT",error);
    
  }
  
  }
  return (
    <div 
    // style={{
    //   display: "flex",
    //   alignItems: "center",
    //   justifyContent: "center",
    // }}
    >
    {/* <h1 className="text-center font-bold text-2xl mt-4"></h1> */}
    <h1 
    style={{
      textAlign: "center",
      fontWeight: "bold",
      marginTop: "4px",
      fontSize: "24px",
      lineHeight: "32px",
    }}
    >
      NotesApp
    </h1>
     <form onSubmit={
      e=>{
        e.preventDefault();
        handleSubmit(form);
      }
     } 
    //  className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch' 
     style={{
      width:"auto",
      minWidth:"25%",
      maxWidth:"min-content",
      marginLeft:"auto",
      marginRight:"auto",
      display:"flex",
      flexDirection: "column",
      alignItems:"stretch",
      marginTop:5,
      marginBottom:5,
     }}
     >
      <input type="text" placeholder='title' value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} 
      // className="border-2 rounded border-gray-600 p-1" 
      style={{
        borderWidth:"2px",
        borderRadius:"4px",
        padding:"4px",
      }}
      />
      <textarea placeholder='Content' value={form.content} onChange={(e) => setForm({...form,content:e.target.value})} 
      // className="border-2 rounded border-gray-600 p-1"    
      style={{
        borderWidth:"2px",
        borderRadius:"4px",
        padding:"4px",
      }} />
     <button type="submit" 
    //  className="bg-blue-500 text-white rounded p-1" 
     style ={{
      backgroundColor: "blue",
      color:"white",
      borderRadius:"4px",
      padding:"4px",
     }}> Add + </button>
     </form>
     <div
     style={{
      width:"auto",
      minWidth:"25%",
      borderWidth:'2px solid black',
      maxWidth:"min-content",
      marginLeft:"auto",
      marginRight:"auto",
      display:"flex",
      flexDirection: "column",
      alignItems:"stretch",
      marginTop:5,
      marginBottom:5,
     }}>
<ul>
  {
    notes.map(note =>(
      // eslint-disable-next-line react/jsx-key
      <li key={note.id} style={{
        borderWidth: "1px solid red",
        padding:4,

      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
        }}>
          <div style={{
            flex:1
          }}>
            <h3 style={{
              fontWeight: "bold",
            }}>
              {note.title}
            </h3>
            <p style={{
              fontWeight: "bold",
              fontSize: "16px",
            }}>
              {note.content}
            </p>

          </div>

        </div>
        
      </li>
    ))
  }
</ul>
     </div>
    </div>
  )
}

export default Home

export const getServerSideProps:GetServerSideProps = async() =>{
  const notes = await prisma?.note.findMany({
    select:{
      title:true,
      id:true,
      content:true,
    }
  })
  return{
    props:{
      notes
    }
  }
}
