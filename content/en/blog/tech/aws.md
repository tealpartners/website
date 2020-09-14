<!-- title: Resolving AWS server downtime when handling high user load -->
<!-- author: Stijn -->
<!-- date: 2020-09-23 -->
<!-- img: /assets/img/blogimages/blog-person-stijn.jpg -->

A retailer contacted us with a pressing issue. Whenever a large number of people visited its site at the same time, some pages would no longer load. At peak times, the website would even crash. With the sales around the corner, this problem had to be resolved as quickly as possible.

The infrastructure of the website consists of several EC2 instance servers with own load balancer per geographical zone. In the backend, the website uses MySQL as an RDS database. ElastiCache for Redis takes care of caching and S3 handles blob data storage. The diagram below illustrates the technical setup.

<img style="width: 100%" src="/assets/img/blogimages/aws-setup.png" alt="aws setup"></img>

This setup allows for the separate configuration of geographical regions. Per market, the trader has a different domain name, with the possibility to adjust the language, products/services offered and prices regionally, and fine-tune the search engine optimisation locally. 

During the stress test, we simulated a systematically increasing number of website visits. What did we find? The load time per individual user increased until there were 140 users on the site simultaneously. At that point, the connection dropped. The website crashed and became inaccessible. 

This is clearly shown in the illustration below. 

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

The logs indicate that the load balancer reports a *502 Bad Gateway* status code. This generally means that the underlying EC2 instance has become unhealthy. But a direct stress test on the EC2 without load balancer tells a different story. 

<div id="graph-2"></div>

The  *connection idle timeout* of the <a href="https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#connection-idle-timeout">load balancer</a> is set at 10 seconds. This means that the connection drops if no data is returned after 10 seconds. When this happens, the EC2 instance is flagged as unhealthy and is removed from the pool. Because there was only one instance running, the load balancer couldn’t process any further requests. This explains why the connection wasn’t stuck at 10 seconds but reverted to zero. 

The question now was why the load time increased to that extent and what we could do about it. Through vertical or horizontal scaling, we spread the CPU load. With horizontal scaling, we use a more powerful server. Vertical scaling means turning on autoscaling. This is the automatic parallel usage of several servers at a higher load. The load balancer spreads the load across the servers. 

The performance measurements of the database indicate that we can optimise by adding indexes, for instance, between the right columns. This is easily done with Amazon RDS Performance Insights. Is the database still a bottleneck? If so, we can also scale it horizontally by installing a more powerful server. 

The customer’s website has to support thousands of simultaneous connections, which is why it is extremely important to use caching. We achieved this with a Redis cache at application level.

The stress test showed that the median load time was still more than 500 milliseconds at peak times. With AWS Lambda, we were able to cache traffic even further. AWS Lambda is serverless code that analyses passing traffic and caches non-personal traffic. 

We also carried out optimisations, such as changing the HTTP server from Apache to NGINX, turning on the PHP OPCache and improving the server configuration settings. 

In doing so, we made sure that the visitor enjoys the best shopping experience, even during the busy sales peak. 


<div class="blogpost__content__kader">

Teal Partners designs & builds software solutions for leading organizations who want to thrive in a digital environment. In a result driven partnership we help them achieve critical business goals.

</div>