import React from 'react'

const Card = (props) => {
  return (
    <div className='bg-blue-950 text-5xl text-white p-4 m-4 rounded-lg shadow-lg'>
        <h1>{props.title}</h1>
        <h2>{props.value}</h2>
    </div>
  )
}

export default Card