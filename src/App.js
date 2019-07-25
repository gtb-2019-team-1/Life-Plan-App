import React from 'react';
import './App.css';
import {LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';
import axios from 'axios';
import FormInputs from './FormInputs';
              
const LIFE_PLAN_APPS_ENDPOINT = "http://118.27.1.4:8080/json1";
const INTERVAL_OF_AVERAGE = 5;
const config = {
  headers: {'Access-Control-Allow-Origin':'*'}
}
              
export default class App extends React.Component {
  constructor(props){
    super(props);

    let init_data = [];
    for(let age = 20; age <= 65; age=age+INTERVAL_OF_AVERAGE){
      init_data.push({age:(age), income:0, expenditure:0, savings:0});
    }
    this.state = {
      data: init_data,
      form_data:[],
      form_data_keys:[]
    };
    this.handleGetByAPI = this.handleGetByAPI.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addForm = this.addForm.bind(this);
  }
  
  componentDidMount(){}
  
  componentWillUnmount(){}

  handleGetByAPI(event){
    var self = this;
    axios
      .get(LIFE_PLAN_APPS_ENDPOINT)
      .then(response => {
        console.log('API通信成功')
        console.log(response)
        let copied_data = this.state.data.slice();
        let render_data = [];
        for(let i=0; i<10; i++){
          copied_data[i].income = response.data.data.cash_data[i].annual_income;
          copied_data[i].expenditure = response.data.data.cash_data[i].annual_expenditure;
          copied_data[i].savings = response.data.data.cash_data[i].savings;
        }
        console.log(render_data);

        this.setState((state) => {
          return {
            data : copied_data
          }
        });
      })

      .catch(() => {
        console.log('APIとの通信失敗');
      });
      event.preventDefault();
  }

  handleChange = (e) => {
    if (["name", "price", "deposit"].includes(e.target.className) ) {
      let form_data = [...this.state.form_data]
      form_data[e.target.dataset.id][e.target.className] = e.target.value.toUpperCase()
      this.setState({ form_data })
    } else {
      this.setState({ [e.target.name]: e.target.value.toUpperCase() })
    }
  }

  addForm = (e) => {
    // console.log(this.state.form_data)
    this.setState((prevState) => ({
      form_data: [...prevState.form_data, {name:"", price:"", deposit:""}],
    }));
  }

  handleSubmit = (event) => {
    let copied_form_data = this.state.form_data.slice();
    let copied_data = this.state.data.slice();
    let form_data_keys = [];

    for(let i=0; i<copied_form_data.length; i++){
      for(let j=0; j<parseInt(copied_form_data[i].price/copied_form_data[i].deposit); j++){
        copied_data[j][copied_form_data[i].name] = copied_form_data[i].deposit;
      }
    }
    for(let i=0; i<copied_form_data.length; i++){
      form_data_keys.push(copied_form_data[i].name);
    }
    console.log(form_data_keys)
    this.setState((state) => {
      return{
        data:copied_data,
        form_data_keys:form_data_keys
      }
    });
    event.preventDefault()
  }
  
// {[...Array(100)].map((item, index) => <span>ID:{index}</span>)}
  render(){
    return (
      <div>
        <div className="form">
        <form onSubmit={this.handleSubmit} onChange={this.handleChange} data={this.state.data} form_data={this.state.form_data}>
          <FormInputs form_data={this.state.form_data} />
          <p className="btn_wrapper">
            <input className="btn addform" type="button" onClick={this.addForm} value="フォームを追加"/>
            <input className="btn submit" type="submit" value="Submit" />
          </p>
        </form>
        </div>

        <div className="chart">
        <LineChart width={1000} height={500} data={this.state.data} form_data_keys={this.state.form_data_keys}>
          <Tooltip/>
          <XAxis dataKey="age" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <Line type="monotone" dataKey="income" stroke="#008080" strokeWidth={2} />
          <Line type="monotone" dataKey="expenditure" stroke="#ff6644" strokeWidth={2} />
          <Line type="monotone" dataKey="savings" stroke="#006400" strokeWidth={2} />
          {[...this.state.form_data_keys].map((item, index) => <Line type="monotone" key={index} dataKey={item} stroke="#006400" strokeWidth={2} />)}
        </LineChart>
          <a onClick={this.handleGetByAPI} data={this.state.data}>さーばーさんでーたをください</a>
        </div>
        <img src="tekkuma.png"></img>
        <div className="get">
          <a onClick={this.handleGetByAPI} data={this.state.data}>さーばーさんでーたをください</a>
          <br />
        </div>
      </div>
    );
  }
}

