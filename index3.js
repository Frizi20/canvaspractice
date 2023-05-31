class BCR {
  static prop = 'static prop'

  nume = 'BCR Bank'
  swift = 123123
  countryOrigin = 'RO'
  accounts = ['cont1', 'cont2']

  constructor(accNr, id, sold, name) {
    this.accNr = accNr
    this.id = id
    this.sold = sold
    this.name = name
  }

  createAccount(newAcc) {
    this.accounts.push(newAcc)
  }

  showAccounts() {
    console.log(this.accounts)
  }

  showNegativeAccounts() {
    console.log('')
  }
}

BCR.staticMethod = function () {
  console.log('I am a static method')
}

BCR.prototype.pay = function (money, accountNr) {
  console.log(`account ${this.accounts[accountNr]} was payed with ${money}`)
}

BCR.prototype.x = function () {}

BCR.prototype.y = function () {}

BCR.prototype.z = function () {}

const acc1 = new BCR(1, 14525, 2000, 'Matac Crisit')
const acc2 = new BCR(2, 21444, 3000, 'Popescu Gabriel')

// console.log(acc1.__proto__  === BCR.prototype)
// console.log(BCR.prototype)
// console.log(acc2.__proto__)

class Animal {
  static createdAnimals = []

  constructor(name, location, age, childClass) {
    this.name = name
    this.location = location
    this.age = age

    Animal.createdAnimals.push({
      name,
      location,
      age,
    })
  }

  static getAnimals() {
    console.log(this.createdAnimals)
  }


  description() {
    const desc = `This animal is called ${this.name}, it is ${this.age} years old and it lives in ${this.location}`
    console.log(desc)
  }

  fnc() {
    console.log('Hi from Animal class')
  }
}

////////////////////

Animal.removeAnimal = function(name){
	this.createdAnimals = this.createdAnimals.filter((animal)=>{
		// console.log(animal.name === name)
		return animal.name !== name
	})

	
}

class Cat extends Animal {
  constructor(name, location, age) {
    super(name, location, age)
  }

  superpower() {
    console.log('this animal purrs')
  }
}

class Dog extends Animal {
  constructor(name, location, age) {
    super(name, location, age)
  }

  superpower() {
    console.log('this animal bites')
  }
}

const cat = new Cat('pisica1', 'Transilvania', 7)
const cat2 = new Cat('pisica2', 'Slobozia', 3)
const cat3 = new Cat('pisica3', 'Constanta', 1)
const dog1 = new Cat('caine1', 'Basarabia', 6)


class Human {
	constructor(name,age){
		
	}
}

class User extends Human {
	
	

	constructor(name, age){
		super(name, age)
		this.name = name 
		this.age = age
	}

	

	introduction(){
		console.log(`
			hi my name is ${this.name} and i'm ${this.age} old
		`)
	}
}


class Admin extends User {

	permisiuni = ['sterge', 'update', 'asda']
	

	constructor(name, age){
		super(name, age)
	}

	getPermisions(){
		console.log(this.permisiuni)
	}
}

const admin = new Admin('Ion', 25)
admin.introduction()



