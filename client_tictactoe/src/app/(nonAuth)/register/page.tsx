import RegisterForm from '@/components/Forms/RegisterForm/RegisterForm'
import { FC, Fragment } from 'react'
import styles from "./page.module.css"
interface RegisterPageProps {
  
}

const RegisterPage: FC<RegisterPageProps> = ({}) => {
  return (
    <Fragment>
      <div className={styles.container}>

      <RegisterForm/>
      </div>
    </Fragment>
  )
} 

export default RegisterPage