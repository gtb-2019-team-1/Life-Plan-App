import React from 'react'
import {LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';

const Graph = (props) => (
  <LineChart width={600} height={300} data={state.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    <Line type="monotone" dataKey="money" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="time" />
    <YAxis />
    <Tooltip />
  </LineChart>
)

export default Graph
