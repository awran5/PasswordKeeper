 interface InputValues  {
  id?: number
  title: string
  password: string
  length: number
  uppercase: boolean
  numbers: boolean
  symbols: boolean
}

 interface InputErrors {
  title: string
  length: string
  password: string
}

 interface PasswordList {
  createdAt: string
  password: string
  title: string
}

 interface Users {
  createdAt: string
  displayName: string
  email: string
  id: string
  passwordList: PasswordList[]
  photoURL: string
}


type HandleModal = (action?: 'remove' | 'close', index?: number) => void

interface ModalProps {
  modal: boolean
  isRemove: boolean
  isSubmit: boolean
  handleModal: HandleModal
  handleReset: () => void
  handleSubmit: () => void
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleGenerate: () => void
  inputValues: InputValues
  inputErrors: InputErrors
}

interface PasswordCardProps {
  handleModal: HandleModal
  storedValues: PasswordList[]
}

interface HeroProps {
  handleModal: HandleModal
}