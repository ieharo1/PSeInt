Algoritmo Adivinarelnúmero
	intentos<-5
	numerosecre<-azar(10)+1
	Escribir "Adivine el número del 1 al 10"
	Leer x
	Mientras numerosecre<>x Y intentos>1 Hacer
		Si numerosecre>x Entonces
			Escribir "Muy bajo"
		SiNo 
			Escribir "Muy alto"
		FinSi
		intentos <- intentos-1
		Escribir "Le quedan ",intentos," intentos:"
		Leer x
	Fin Mientras
	Si numerosecre=x Entonces
		Escribir "Exacto! Usted adivino en ",5-intentos," intentos."
	SiNo
		Escribir "El numero era: ",numerosecre
	FinSi
FinAlgoritmo
