<!-- title: Het oplossen van AWS-server downtime bij een grote gebruikersbelasting -->
<!-- author: Stijn -->
<!-- date: 2020-09-23 -->
<!-- img: /assets/img/blogimages/blog-person-stijn.jpg -->

Een retailer contacteerde ons met een prangende vraag. Als er veel bezoekers tegelijk op zijn website kwamen, dan laadden niet alle pagina’s meer. Op piekmomenten crashte de website zelfs. Met de solden in aantocht moest dit probleem zo snel mogelijk van de baan. 

De infrastructuur van de website bestaat uit meerdere EC2 instance servers met een eigen load balancer per geografische zone. Achterliggend gebruikt de website MySQL als een RDS database. ElastiCache for Redis zorgt voor caching en S3 garandeert de opslag van blob data. In het schema hieronder zie je de technische opstelling.

<img style="width: 100%" src="/assets/img/blogimages/aws-setup.png" alt="aws setup"></img>
 
Deze opstelling voorziet de mogelijkheid om geografische regio’s apart te configureren. Per afzetmarkt beschikt de handelaar over een andere domeinnaam. Hij kan de taal, het aanbod en de prijs regionaal aanpassen en de zoekmachineoptimalisatie lokaal op punt stellen. 

Tijdens de stresstest simuleerden we een stelstelmatig toenemend aantal websitebezoeken. Wat merkten we op? De laadtijd per individuele gebruiker steeg tot er 140 gebruikers tegelijk op de site waren. Dan viel de connectie weg. De website crashte en werd onbereikbaar. 

Dit is duidelijk te zien in de onderstaande figuur.
 <script type="text/javascript" src="https://d3js.org/d3.v4.min.js"></script>
 <script type="text/javascript" src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
 <script async type="text/javascript" src="/assets/js/aws-graph.js"></script>

 <style> 
    .line {
    fill: none;
    stroke: green;
    stroke-width: 5px;
    }
</style>
<div id="graph-1"></div>


De logs geven aan dat de load balancer een statuscode *502 Bad Gateway* rapporteert. Dit betekent doorgaans dat de onderliggende EC2 instance ongezond is geworden. Maar een rechtstreekse stresstest op de EC2 zonder load balancer vertelt een ander verhaal.

<div id="graph-2"></div>

De *connection idle timeout* van de <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#connection-idle-timeout">load balancer</a> staat ingesteld op 10 seconden. Dit betekent dat de connectie uitvalt als er na 10 seconden geen data terugkomt. In dat geval wordt de EC2 instance als ongezond gemarkeerd en verdwijnt hij uit de pool. Omdat er maar één instance liep, kon de load balancer geen verzoeken meer afhandelen. Dit verklaart waarom de connectie niet bleef hangen op 10 seconden maar terugviel naar nul. 

Rest de vraag waarom de laadtijd zo oploopt, en wat we eraan kunnen doen. Door verticaal of horizontaal te schalen, spreiden we de CPU load. Bij horizontaal schalen gebruiken we een zwaardere server. Verticaal schalen betekent het aanzetten van autoscaling. Dit is het automatisch parallel inzetten van meerdere servers bij een hogere load. De load balancer verspreidt de load over de servers. 

De performantiemetingen van de database geven aan dat we kunnen optimaliseren door bijvoorbeeld indexen te leggen tussen de correcte kolommen. Dit kan makkelijk met Amazon RDS Performance Insights. Is de database nog steeds de bottleneck? Dan kunnen we deze ook horizontaal schalen door een zwaardere server te plaatsen. 

De website van de klant moet duizenden simultane connecties ondersteunen. Daarom is het van vitaal belang om caching te gebruiken. Dit realiseerden we met een Redis cache op applicatieniveau. 

Uit de stresstest bleek dat op piekmomenten de mediaan laadtijd nog steeds meer dan 500 milliseconden bedroeg. Met AWS Lambda konden we het verkeer nog verder cachen. AWS Lambda is serverless code die het passerende verkeer analyseert en het niet-gepersonaliseerde verkeer cachet. 

We voerden ook optimalisaties uit, zoals het veranderen van de HTTP server van Apache naar NGINX, het aanzetten van de PHP OPCache en het beter afstellen van de serverconfiguratie. 

Op die manier garandeerden we de beste winkelervaring voor de bezoeker, ook tijdens de drukke soldenpiek. 

<div class="blogpost__content__kader">

Teal Partners ondersteunt organisaties die digitaal willen uitbliken via consultancy en oplossingen op maat. Onze ontwikkelaars hebben een jarenlange ervaring en een sterke affiniteit met het ontwikkelen van cloudapplicaties en het optimaliseren van de IT-infrastructuur in de cloud. 

</div>