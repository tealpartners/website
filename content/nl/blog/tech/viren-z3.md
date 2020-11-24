<!-- title: Netto loon optimaliseren doormiddel van Viren Z3 rekenmotor -->
<!-- hide: True -->
<!-- author: Stijn -->
<!-- date: 2020-11-24 -->
<!-- img: /assets/img/blogimages/blog-person-stijn.jpg -->

Netto loon optimaliseren doormiddel van Viren Z3 rekenmotor
Eén van de meest gestelde loon vragen is waarschijnlijk: “Hoe kan ik mijn netto loon optimaliseren?”. Traditioneel is dit een vraag opgelost door consultants die via hun buikgevoel een oplossing aanrijken. Maar is het ook mogelijk om dit wiskundig te bewijzen dat één bepaalde oplossing te beste is?
Om dit te bereiken moeten we als eerste stap de Belgische loon wetgeving modelleren. Dit wilt zeggen dat we de wetgeving omzetten naar wiskundige regels. Hiervoor gebruikt Teal Partners de Viren kennisbeheer tool. In deze tool kunnen we aan de hand van de Viren Financial Modeling Language (FML) wetgeving uitmodeleren.
netto_loon=brutto_loon*belasting_percentage  
Deze modeleertaal is speciaal ontwikkeld om domein experten te kunnen ondersteunen. Door de gelijkaardige notatie als Excel en het intuïtief blokken systeem kan iedereen kennis modelleren. Dit is een groot vooruitgang als we dit vergelijken met de traditionele uitwerking dat eerst een domein expert de wetgeving moet uitleggen aan een programmeur, waarop deze met goed geluk de wetgeving juist interpreteert en implementeert.
Door domein expert zelf hun kennis te laten beheren worden er veel fouten vermeden en moet deze expert niet wachten tot dat er een programmeur vrij is om de kennis aan te passen.

Als de wetgeving gemodelleerd is in Viren wordt deze ook automatisch omgezet naar regels die begrepen wordt door de Viren Z3 solver. Aan deze tool kunnen we dan vragen stellen zoals:
	Hoeveel is mijn bruto loon als ik 2 000 euro netto wil verdienen?
	Welke opties zijn er mogelijk om loon verder te optimaliseren? 
	Zijn maaltijdcheques en/of een GSM de beste oplossing voor mij?
Xerius heeft deze vragen in een gebruiksvriendelijke tool gezet die je hier kan uitproberen: brutonetto.xerius.be 
Wat je direct zou opvallen is hoe snel dat je resultaten terug krijgt. Typisch gezien wordt  het oplossen van zo’n vraagstuk uitgevoerd in een nachtelijk batch job. Door onze cloud native aanpakt kunnen we deze vragen direct beantwoorden. 
Omdat we onze modellen zo geoptimaliseerd omzetten kan je deze zelfs op elk apparaat uitvoeren! Geen dure servers meer nodig enkel en alleen een knop in je browser.
Gewenst netto loon: 2 000 euro
Oplossing A)
Maaltijdcheques: Ja, Bruto loon: 5 000 euro
Oplossing B)
Maaltijdcheques: Nee, Bruto loon: 5 500 euro

<form class="blogpost__content__kader">
    <div>
        <label for="netto">Netto</label>
        <input id="netto" name="netto" type="number" min="1" max="10000" value="2000" required>
    </div>
    <div>
        <input id="mc" name="mc" type="checkbox">
        <label for="mc">Maaltijdcheques</label>
    </div>
    <button id="run" type="button">Bereken</button>
    <div>
        Bruto loon: <span id="result"></span>euro
    </div>
</form>
<div id="output">

</div>

<script type="text/javascript" src="/assets/js/z3/protocol.js"></script>
<script type="text/javascript" src="/assets/js/z3/demo.js"></script>
<script>
    makeZ3Demo(window, queries, responses).init();
</script>
