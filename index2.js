

// 3

var myObject = {
    foo: "bar",
    func: function() {
        var self = this;

        console.log("outer func:  this.foo = " + this.foo);
        console.log("outer func:  self.foo = " + self.foo);

        (function() {
            console.log("inner func:  this.foo = " + this.foo);
            console.log("inner func:  self.foo = " + self.foo);
        }());
    }
};
myObject.func();


console.log('---------------------------------------')
console.log('')
console.log('---------------------------------------')

// 4 

// (function($) { /* jQuery plugin code referencing $ */ } )(jQuery);


class Presentation{
	constructor(nume, prenume){
		this.nume = nume
		this.prenume  = prenume
	}

	introduction(){
		console.log(
			'Hi, my name is ' + this.nume +' and my last name is '+ this.prenume
		)
	}
}

const librarie = new Presentation('Cristi','Matac');

librarie.introduction();

(function(library){
	const lib = new library('zzz','yyyyyy')
	lib.introduction()

})(Presentation);