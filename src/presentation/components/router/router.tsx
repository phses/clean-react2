import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

type Props = {
  MakeLogin: React.FC
  MakeSignUp: React.FC
}

const Router: React.FC<Props> = ({ MakeLogin, MakeSignUp }: Props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<MakeLogin />} />
        <Route path='/signup' element={<MakeSignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
