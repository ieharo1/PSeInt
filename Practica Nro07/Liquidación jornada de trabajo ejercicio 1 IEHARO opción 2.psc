Algoritmo LiquidacionJornadaDeTrabajo
		Definir nombre Como Caracter
		Definir valtrf, horatrbj, jornal, horaext Como Real
		Repetir
			Escribir "Ingrese el nombre del empleado"
			Leer nombre
			Si nombre!="" Entonces
				Escribir "Ingrese el valor de la tarifa"
				Leer valtrf
				Escribir "Horas trabajadas"
				Leer horatrbj
				horaext<-horatrbj-38
				Si horaext>0 Entonces
					jornal<-(horaext* valtrf *0.60) + (horatrbj * valtrf)
				SiNo
					jornal<-valtrf*horatrbj
				Fin Si
				Escribir "El jornal de " nombre " es: " jornal
			Fin Si
		Hasta Que nombre=""
FinAlgoritmo
