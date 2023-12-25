import LoginForm from '@/components/Forms/LoginForm/LoginForm'
import { FC, Fragment } from 'react'
import styles from "./page.module.css"
interface LoginPageProps {
  
}

const LoginPage: FC<LoginPageProps> = ({}) => {
  return (
    <Fragment>
      <div className={styles.container}>

      <LoginForm/>
      </div>
    </Fragment>
  )
}

export default LoginPage