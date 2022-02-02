import styles from '../styles/components/Modal.module.scss'
import { AiOutlineClose } from 'react-icons/ai'

function Modal({show, onCloseModal, children, title}) {
    if(!show) return null
    return (
        <div className={styles.modal_container}>
            <div className={styles.modal_content}>
                <div className={styles.modal_header}>
                    <div className='text-slate-900 text-lg font-bold'>
                        {title}
                    </div>
                    <div className={styles.modal_header_close} onClick={onCloseModal}>
                        <AiOutlineClose/>
                    </div>
                </div>
                <div className={`${styles.modal_body} mt-6`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
