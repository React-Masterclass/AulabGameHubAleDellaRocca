import React, {useEffect, useState} from 'react'

function UseDebounceSearch( query ) {
    const [value, setValue] = useState(query);

    useEffect(() => {
        let timeoutId = setTimeout(() => {
            setValue(query)
        },600)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [query]);


    return value
}

export default UseDebounceSearch
