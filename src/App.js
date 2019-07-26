import React from 'react';
import './App.css';
import {LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';
import axios from 'axios';
import FormInputs from './FormInputs';

              
const LIFE_PLAN_APPS_ENDPOINT = "http://118.27.0.198:8080/json"
const INTERVAL_OF_AVERAGE = 5;
const deathLine = 2000;
const config = {
  headers: {'Access-Control-Allow-Origin':'*'}
}
let conohaText;
              
export default class App extends React.Component {
  constructor(props){
    super(props);

    let init_data = [];
    for(let age = 20; age <= 65; age=age+INTERVAL_OF_AVERAGE){
      init_data.push({age:(age), income:0, expenditure:0, savings:0, border:2000});
    }
    this.state = {
      data: init_data,
      form_data:[],
      form_data_keys:[],
      id:'',
      password:''
    };
    this.handleGetByAPI = this.handleGetByAPI.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addForm = this.addForm.bind(this);
    this.idChange = this.idChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
  }
  
  componentDidMount(){}
  
  componentWillUnmount(){}

  handleGetByAPI(event){
    var self = this;
    axios
      .get(LIFE_PLAN_APPS_ENDPOINT, {
        params: {
          accountNumber:this.state.id,
          password:this.state.password
        }
      })
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
        if(copied_data[9].savings >4000){
          conohaText = "もっと私に貢げるんじゃない？";
        }else if(copied_data[9].savings < deathLine){
          conohaText = "このままじゃ将来不安なの。";
        }else{
          conohaText = "まだまだ私に貢げそうね♡";
        }  

        this.setState((state) => {
          return {
            data : copied_data
          }
        });
  
      })

      .catch(() => {
        alert("口座番号またはパスワードが違います。")
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
    this.setState((prevState) => ({
      form_data: [...prevState.form_data, {name:"", price:"", deposit:""}],
    }));
  }

  handleSubmit = (event) => {
    let copied_form_data = this.state.form_data.slice();
    let copied_data = this.state.data.slice();
    let form_data_keys = [];
    let deposit = 0;
    let deposit_sum = 0;
    deposit = (copied_form_data[0].price / (Math.ceil(copied_form_data[0].price/copied_form_data[0].deposit/INTERVAL_OF_AVERAGE)*INTERVAL_OF_AVERAGE))*INTERVAL_OF_AVERAGE;
    for(let i=0; i<copied_form_data.length; i++){
      for(let j=0; j<Math.ceil(copied_form_data[i].price/copied_form_data[i].deposit)/INTERVAL_OF_AVERAGE; j++){
        deposit_sum = deposit_sum + deposit;
        copied_data[j][copied_form_data[i].name] = deposit;
        copied_data[j].savings = copied_data[j].savings - deposit_sum;
      }
    }
    for(let j=Math.ceil(Math.ceil(copied_form_data[0].price/copied_form_data[0].deposit)/INTERVAL_OF_AVERAGE); j<copied_data.length; j++){
      copied_data[j].savings = copied_data[j].savings - deposit_sum;
    }

    for(let i=0; i<copied_form_data.length; i++){
      form_data_keys.push(copied_form_data[i].name);
    }
    if(copied_data[9].savings >4000){
      conohaText = "もっと私に貢げるんじゃない？";
    }else if(copied_data[9].savings < deathLine){
      conohaText = "このままじゃ将来不安なの。";
    }else{
      conohaText = "まだまだ私に貢げそうね♡";
    }  

    this.setState((state) => {
      return{
        data:copied_data,
        form_data_keys:form_data_keys
      }
    });
    event.preventDefault()
  }
  
  idChange(event) {
    this.setState({id: event.target.value});
  }

  passwordChange(event) {
    this.setState({password: event.target.value});
  } 
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
          <br /><br />
          <LineChart width={750} height={500} data={this.state.data} form_data_keys={this.state.form_data_keys}>
          <Tooltip/>
          <XAxis dataKey="age" />
          <YAxis />
          <CartesianGrid troke="#eee" strokeDasharray="5 5"/>
          <Line type="monotone" dataKey="income" stroke="#008080" strokeWidth={2} />
          <Line type="monotone" dataKey="expenditure" stroke="#ff6644" strokeWidth={2} />            <Line type="monotone" dataKey="savings" stroke="#006400" strokeWidth={2} />
          <Line type="monotone" dataKey="border" stroke="#000000" strokeWidth={2} />
          {/*[...this.state.form_data_keys].map((item, index) => <Line type="monotone" key={index} dataKey={item} stroke="#006400" strokeWidth={2} />)*/}
          </LineChart>
        </div>
        <img className="conoha" src="https://pbs.twimg.com/profile_images/1097324741814149120/uCW6StGr.png" />
        <div className="login">
        　  口座番号<input className="login_form" type="text" value={this.state.id} onChange={this.idChange} />
            パスワード<input className="login_form" type="password" value={this.state.password} onChange={this.passwordChange} />
            <input  className="btn go" onClick={this.handleGetByAPI} type="button" data={this.state.data} value="あなたの未来"/>
          </div>
          <div　className="conohaText" >{conohaText}</div>
      </div>
    );
  }
}

