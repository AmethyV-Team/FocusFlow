import { Component, ElementRef, ViewChild, effect, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var d3: any;

@Component({
  selector: 'app-velocity-meter',
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
      <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Hourly Velocity</h3>
      <div #chartContainer class="relative flex items-center justify-center">
        <!-- D3 Chart will be appended here -->
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-3xl font-bold text-slate-800">{{ current() }}</span>
          <span class="text-[10px] text-slate-400">/ {{ goal() }} goal</span>
        </div>
      </div>
      <p class="mt-2 text-xs text-center text-slate-400">Tasks / Hour</p>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class VelocityMeterComponent {
  current = input.required<number>();
  goal = input<number>(5);

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  constructor() {
    effect(() => {
      if (this.chartContainer?.nativeElement) {
        this.renderChart(this.current(), this.goal());
      }
    });
  }

  renderChart(current: number, goal: number) {
    const element = this.chartContainer.nativeElement;
    d3.select(element).select('svg').remove();

    const width = 120;
    const height = 120;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create the arc generator
    const arc = d3.arc()
      .innerRadius(radius * 0.8)
      .outerRadius(radius)
      .startAngle(0);

    // Background Arc
    svg.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .style('fill', '#f1f5f9')
      .attr('d', arc);

    // Foreground Arc
    const percentage = Math.min(current / goal, 1);
    const endAngle = percentage * 2 * Math.PI;

    // Color scale logic
    let color = '#3b82f6'; // Blue
    if (percentage >= 1) color = '#22c55e'; // Green
    if (percentage < 0.3 && current > 0) color = '#ef4444'; // Red

    svg.append('path')
      .datum({ endAngle: endAngle })
      .style('fill', color)
      .attr('d', arc)
      .style('transition', 'all 0.5s ease-out'); // Simple CSS transition for color
  }
}