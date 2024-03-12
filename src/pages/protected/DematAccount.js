import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import DematAccount from '../../features/settings/dematAccount'

function InternalPage(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "All Demat Account Links"}))
      }, [dispatch])
      
    return(
        <DematAccount />
    )
}

export default InternalPage