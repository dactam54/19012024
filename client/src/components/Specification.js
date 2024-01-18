import React, { memo } from 'react'

const Specification = ({ overviews, title, hideShadow }) => {
    // console.log(overviews)
    return (
        <div className={`${hideShadow ? '' : 'border shadow-md rounded-md'} p-4`}>
            <h3 className='text-base font-bold mb-4'>{title}</h3>
            <table className="table-auto border text-sm">
                <tbody>
                    {overviews?.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                            <td className='p-2'>{item?.key}</td>
                            <td className='p-2'>{typeof (item?.values) === 'string' ? item.values : item?.values?.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default memo(Specification)