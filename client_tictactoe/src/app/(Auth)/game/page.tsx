import GameWrapper from '@/components/GameWrapper/GameWrapper'
import { ENV_VAR } from '@/configs/env.config'
import SocketGameProvider from '@/contextAPI/providers/SocketGameProvider'
import { FC, Fragment } from 'react'
import styles from "./page.module.css"


interface GamePageProps {
  
}

const GamePage: FC<GamePageProps> = ({}) => {
  return (
    <Fragment>
            {/* <SocketGameProvider
        // url={ENV_VAR.SOCKET_PROXY_GATEWAY_URL + ENV_VAR.SOCKET_EXT}
      > */}
        <div className={styles.container}>

      <GameWrapper/>
        </div>
      {/* </SocketGameProvider> */}
    </Fragment>
  )
}

export default GamePage