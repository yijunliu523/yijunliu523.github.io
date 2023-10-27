// female color: #9F353A
// male color: #005CAF


// Vis 1

async function vis1(dataset, HTMLID) {
    await d3.csv(dataset).then(function(data) {
        const svg = d3.select(`#${HTMLID}`);
    
        const xScale = d3.scaleBand()
        .domain(data.map(d => d.Country))
        .range([50, 750])
        .padding(0.4);
    
        const yScaleGDI = d3.scaleLinear()
        .domain([0, 1])
        .range([280, 20]);

        svg.selectAll(".male")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Country))
        .attr("cy", 150)
        .attr("r", d => Math.sqrt(d["year-male"]) * 9)
        .attr("fill", "#005CAF")
        .attr("opacity", 0.5);
    
        svg.selectAll(".female")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Country))
        .attr("cy", 150) 
        .attr("r", d => Math.sqrt(d["year-female"]) * 9) 
        .attr("fill", "#9F353A")
        .attr("opacity", 0.5);
    
        const line = d3.line()
        .x(d => xScale(d.Country))
        .y(d => yScaleGDI(d.GDI));
    
        svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line);
    
        svg.append("g")
        .attr("transform", "translate(0, 200)")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
        svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(yScaleGDI));
    
        svg.selectAll(".femaleText")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.Country))
        .attr("y", 150)
        .attr("dy", d => Math.sqrt(d["year-male"]) * 10 + 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "8px")
        .attr("fill", "grey")
        .text(d => `f: ${d["year-female"]}y`);
    
        svg.selectAll(".maleText")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.Country))
        .attr("y", 150)
        .attr("dy", d => Math.sqrt(d["year-male"]) * 10 + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "8px")
        .attr("fill", "grey")
        .text(d => `m: ${d["year-male"]}y`);

        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - (300 / 2))
        .attr("dy", "1em")
        .attr("font-size", "10px")
        .attr("opacity", "1")
        .style("text-anchor", "middle")
        .text("GDI");
    
        const legend = svg.append("g")
                    .attr("transform", "translate(600, 70)");
    
        legend.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 6).style("fill", "#9F353A").style("opacity", 0.5);
        legend.append("circle").attr("cx", 0).attr("cy", 20).attr("r", 6).style("fill", "#005CAF").style("opacity", 0.5);
        legend.append("line").attr("x1", -6).attr("y1", 40).attr("x2", 6).attr("y2", 40).style("stroke", "green").style("stroke-width", 2);
        legend.append("text").attr("x", 10).attr("y", 0).text("Female").style("font-size", "12px").attr("alignment-baseline", "middle");
        legend.append("text").attr("x", 10).attr("y", 20).text("Male").style("font-size", "12px").attr("alignment-baseline", "middle");
        legend.append("text").attr("x", 10).attr("y", 40).text("GDI (f:m)").style("font-size", "12px").attr("alignment-baseline", "middle");
    
    });
}

vis1("../website/data/true/school.csv", "true_vis_1");
vis1("../website/data/false/school.csv", "false_vis_1");



// Vis 2

async function vis2(dataset, HTMLID) {
    const data = await d3.csv(dataset);
    data.forEach(d => {
        d.MenSalary = +d.MenSalary;
        d.WomenSalary = +d.WomenSalary;
        d.PayGap = +d.PayGap;
        d.PayGapPct = +d.PayGapPct;
      });
    
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const width = 780 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    const svg = d3.select(`#${HTMLID}`)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const x = d3.scaleBand()
                .domain(data.map(d => d.Category))
                .range([0, width])
                .padding(0.4);
  
    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => +d.MenSalary)])
                .range([height, 0]);
  
    svg.selectAll(".menBar")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", d => x(d.Category))
       .attr("y", d => y(+d.MenSalary))
       .attr("width", x.bandwidth())
       .attr("height", d => height - y(+d.MenSalary))
       .attr("fill", "#005CAF")
       .attr("opacity", 0.5);

    svg.selectAll(".womenBar")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", d => x(d.Category))
       .attr("y", d => y(+d.WomenSalary))
       .attr("width", x.bandwidth())
       .attr("height", d => height - y(+d.WomenSalary))
       .attr("fill", "#9F353A")
       .attr("opacity", 0.5);
  
    svg.selectAll(".label")
       .data(data)
       .enter()
       .append("text")
       .attr("x", d => x(d.Category) + x.bandwidth() / 2)
       .attr("y", d => y(+d.MenSalary) - 5)
       .attr("text-anchor", "middle")
       .attr("fill", "black")
       .attr("font-size", "10px")
       .text(d => `Gap: ${d.PayGapPct.toFixed(2)}%`);
  
    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "12px");

    svg.append("text")
    .attr("transform", "rotate(0)")
    .attr("y", -10 )
    .attr("x", -20)
    .attr("dy", "1em")
    .attr("font-size", "10px")
    .attr("opacity", "1")
    .style("text-anchor", "middle")
    .text("Annual $");
  
    svg.append("g")
       .call(d3.axisLeft(y));

       const legend = svg.append("g")
       .attr("transform", "translate(600,20)");

    legend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "#9F353A")
    .style("opacity", 0.5);

    legend.append("rect")
    .attr("x", 0)
    .attr("y", 20)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "#005CAF")
    .style("opacity", 0.5);

    legend.append("text")
    .attr("x", 15)
    .attr("y", 10)
    .text("Women's Salary")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

    legend.append("text")
    .attr("x", 15)
    .attr("y", 30)
    .text("Men's Salary")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");

  }

vis2("../website/data/true/pay.csv", "true_vis_2");
vis2("../website/data/false/pay.csv", "false_vis_2");

async function vis3(dataset, HTMLID) {
    const data = await d3.csv(dataset);
    data.forEach(d => {
      d.Total_Men = +d.Total_Men;
      d.Total_Women = +d.Total_Women;
      d.Unpaid_Men = +d.Unpaid_Men;
      d.Unpaid_Women = +d.Unpaid_Women;
    });
  
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = 750 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
  
    const svg = d3.select(`#${HTMLID}`)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const x = d3.scaleBand()
                .domain(data.map(d => d.Country))
                .range([0, width])
                .padding(0.4);
  
    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => Math.max(d.Total_Men, d.Total_Women))])
                .range([height, 0]);
  
    svg.selectAll(".menBar")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", d => x(d.Country))
       .attr("y", d => y(d.Total_Men))
       .attr("width", x.bandwidth()/2)
       .attr("height", d => height - y(d.Total_Men))
       .attr("fill", "#005CAF")
       .attr("opacity", 0.5);
  
    svg.selectAll(".menUnpaidBar")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", d => x(d.Country))
       .attr("y", d => y(d.Unpaid_Men))
       .attr("width", x.bandwidth()/2)
       .attr("height", d => height - y(d.Unpaid_Men))
       .attr("fill", "#0B346E")
       .attr("opacity", 0.5);
  
    svg.selectAll(".womenBar")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", d => x(d.Country) + x.bandwidth()/2)
       .attr("y", d => y(d.Total_Women))
       .attr("width", x.bandwidth()/2)
       .attr("height", d => height - y(d.Total_Women))
       .attr("fill", "#9F353A")
       .attr("opacity", 0.5);
  
    svg.selectAll(".womenUnpaidBar")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", d => x(d.Country) + x.bandwidth()/2)
       .attr("y", d => y(d.Unpaid_Women))
       .attr("width", x.bandwidth()/2)
       .attr("height", d => height - y(d.Unpaid_Women))
       .attr("fill", "#64363C")
       .attr("opacity", 0.5);
  
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x))
       .selectAll("text")
       .style("font-size", "10px")
       .attr("transform", "rotate(-45)")
       .style("text-anchor", "end");
  
    svg.append("g")
       .call(d3.axisLeft(y));

       svg.append("text")
       .attr("transform", "rotate(0)")
       .attr("y", -15)
       .attr("x", -20)
       .attr("dy", "1em")
       .attr("font-size", "10px")
       .attr("opacity", "1")
       .style("text-anchor", "middle")
       .text("Min/Day");
     

       const legend = svg.append("g")
       .attr("transform", `translate(${width - 100},${height - 240})`);

    const categories = [
    { label: "Men (Unpaid)", color: "#0B346E" },
    { label: "Men (Paid)", color: "#005CAF" },
    { label: "Women (Unpaid)", color: "#64363C" },
    { label: "Women (Paid)", color: "#9F353A" }
    ];

    categories.forEach((category, i) => {
    const legendRow = legend.append("g")
                .attr("transform", `translate(0, ${i * 20})`);

    legendRow.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", category.color)
    .attr("opacity", 0.5);

    legendRow.append("text")
    .attr("x", 20)
    .attr("y", 10)
    .attr("text-anchor", "start")
    .style("font-size", "12px")
    .text(category.label);
    });
  }

vis3("../website/data/true/unpaid_work.csv", "true_vis_3");
vis3("../website/data/false/unpaid_work.csv", "false_vis_3");

async function vis4(dataset, HTMLID) {
  const data = await d3.csv(dataset);
  data.forEach(d => {
    d.Value = +d.Value;
  });

  const margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 500 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

  const worldAverage = d3.mean(data, d => d.Value);

  const svg = d3.select(`#${HTMLID}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([d3.min(data, d => d.Value), d3.max(data, d => d.Value)])
    .range([0, width]);

    const yPosition = height - 20; 

  
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.Value))
      .attr("cy", yPosition)
      .attr("r", 3)  
      .attr("opacity", 0.4)
      .attr("fill", "#005CAF");
  
    svg.append("circle")
      .attr("cx", x(worldAverage))
      .attr("cy", yPosition)
      .attr("r", 5) 
      .attr("fill", "red");
  
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

    svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom})`)
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("% of women");
  
    const legend = svg.append("g")
      .attr("transform", "translate(280,10)");
  
    legend.append("circle")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 5)
      .style("fill", "red");
  
    legend.append("text")
      .attr("x", 25)
      .attr("y", 15)
      .attr("font-size", "15px")
      .text(`World Avg: ${worldAverage.toFixed(2)}`);
  }




vis4("../website/data/true/dv.csv", "true_vis_4");
vis4("../website/data/false/dv.csv", "false_vis_4");

async function vis5(dataset, HTMLID) {
    const data = await d3.csv(dataset);
  
    const margin = { top: 20, right: 20, bottom: 30, left: 50 },
          width = 730 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;
  
    const svg = d3.select(`#${HTMLID}`)
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const x = d3.scalePoint()
                .domain(data.map(d => d.Region))
                .range([0, width])
                .padding(0.5);
  
    const y = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
  
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    const line = d3.line()
                   .x(d => x(d.Region))
                   .y(d => y(d.value));
  
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x));
  
    svg.append("g")
       .call(d3.axisLeft(y));
  
    ['% all pregancy ended in abortion', '% unintended pregancy', '% unintended ended in abortion'].forEach(key => {
      const dataMapped = data.map(d => ({ Region: d.Region, value: +d[key] }));
      
      svg.append("path")
         .datum(dataMapped)
         .attr("fill", "none")
         .attr("stroke", color(key))
         .attr("d", line);
  
         const sanitizedKey = key.replace(/\W+/g, "_");
         svg.selectAll(`.${sanitizedKey}`)         
         .data(dataMapped)
         .enter()
         .append("circle")
         .attr("class", sanitizedKey)
         .attr("cx", d => x(d.Region))
         .attr("cy", d => y(d.value))
         .attr("r", 5)
         .attr("fill", color(key));
    });
  
    const legend = svg.append("g")
                      .attr("transform", "translate(" + (width - 150) + ",0)");
  
    const legendKeys = ['% all pregancy ended in abortion', '% unintended pregancy', '% unintended ended in abortion'];
  
    legend.selectAll("rect")
          .data(legendKeys)
          .enter()
          .append("rect")
          .attr("x", 0)
          .attr("y", (d, i) => i * 20)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", d => color(d));
  
    legend.selectAll("text")
          .data(legendKeys)
          .enter()
          .append("text")
          .attr("font-size", "10px")
          .attr("x", 25)
          .attr("y", (d, i) => i * 20 + 14)
          .text(d => d);
  }
  

vis5("../website/data/true/abortion.csv", "true_vis_5");
vis5("../website/data/false/abortion.csv", "false_vis_5");