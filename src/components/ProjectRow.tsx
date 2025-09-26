import React from 'react'
import { formatCurrency1, formatPercent } from '../utils'

export default function ProjectRow(props: any) {
    const p = props.project!
    const onDelete = props.onDelete

    function handleDeleteClick() {
        if (confirm('Delete?')) onDelete(p.id)
    }


    return (
        <tr className="hover:bg-gray-50">
            <td className="px-3 py-2 text-sm">{p.name}</td>
            <td className="px-3 py-2 text-sm">{formatCurrency1(p.creditValue)}</td>
            <td className="px-3 py-2 text-sm">{formatPercent(p.yield)}</td>
            <td className="px-3 py-2 text-sm">{p.status}</td>
            <td className="px-3 py-2 text-sm">
                <button className="text-red-600 underline" onClick={handleDeleteClick}>Remove</button>
            </td>
        </tr>
    )
}